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
    const [winner, setwinner] = useState("")
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    console.log(`raffle address ${raffleAddress}`)
    console.log(parseInt(chainIdHex))
    const dispatch = useNotification()
    //the reason moralis knows what chain we are on,
    //the header passes all the info about metamask to the moralis provider
    //then the provider in app passes the info down to the whole app
    const { runContractFunction: enterRaffle } = useWeb3Contract({
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
        <div>
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async () =>
                            await enterRaffle({
                                // onComplete:
                                // onError:
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }
                    >
                        enter raffle
                    </button>
                    Entrance Fee : {ethers.utils.formatUnits(fee, "ether")} ETH a Number of palyers:
                    {players}
                    RecentWinner: {winner}
                </div>
            ) : (
                <div> No raffle Address </div>
            )}
        </div>
    )
}