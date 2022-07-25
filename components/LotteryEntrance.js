//have a function to call the entrance lottery
//we can use moralis again !
//one of the hooks is useWeb3Contract
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit" //this hook gives a call called dispatch

//we use this to get the chainid
export default function LotteryEntrance() {
    //let fee = ""; can not do this, because when we update fee , it will not trigger a re-render--> that is why we use use-state
    const [fee, setFee] = useState("0")
    const [players, setplayers] = useState("0")
    const [winner, setwinner] = useState("0")
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(`raffle address ${raffleAddress}`)
    console.log(parseInt(chainIdHex))
    const dispatch = useNotification()
    //the reason moralis knows what chain we are on,
    //the header passes all the info about metamask to the moralis provider
    //then the provider in app passes the info down to the whole app
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        args: {},
        msgValue: fee,
        //what is msg.value? --> it is out entrance fee! we only want to update this var when web 3 is enabled --> that is why we use isWeb3Enabled
        // use "useEfFECT"
    })

    const { runContractFunction: getEntraceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntraceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    async function updateUi() {
        const temp = (await getEntraceFee()).toString()
        setFee(temp)
        //why can't we use ethers.utils.parseEther?
        // setFee(ethers.utils.parseEther(temp));
        console.log(fee)
        const playerssize = (await getNumberOfPlayers()).toString()
        const recentwinner = await getRecentWinner()
        setplayers(playerssize)
        setwinner(recentwinner)
        console.log(players)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read entrance fee

            updateUi()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "transaction complete",
            title: "tx notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }
    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded p-2 ml-auto"
                        onClick={async () =>
                            await enterRaffle({
                                //note that this does not automatically updat the winner, becuase success if tied to enter raffle,
                                //we need to tie a listner to listen for the winner event so we can trigger a re-render
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                        disabled={isLoading || isFetching}
                    >
                        enter raffle
                    </button>
                    <div>Entrance Fee : {ethers.utils.formatUnits(fee, "ether")}</div>
                    <div>ETH a Number of palyers:{players}</div>
                    <div>RecentWinner: {winner} </div>
                </div>
            ) : (
                <div> No raffle Address </div>
            )}
        </div>
    )
}
