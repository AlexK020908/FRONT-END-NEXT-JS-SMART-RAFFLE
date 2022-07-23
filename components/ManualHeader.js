//how do we create a connect button
import { useMoralis } from "react-moralis"
import { useEffect } from "react"
export default function ManualHeader() {
    const { enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis() //hoook --> keep track of states
    //this state helps us to dynamically rerenter when smt changes
    //account checks if we have connected to an account
    //is web3enableLoading checks if meta mask is popped up, if metamask is popped up, we don't want the user to keep pressing connect --> too many requests

    //when we hit refresh --> the website does not know we are connected already , which gets really annoying ,
    //that is why we need a functionality so that the instand we re-render, we check if we are connected, that is why we use use-effect

    useEffect(() => {
        /*
        if (isWeb3Enabled) return
        enableWeb3()

        doing this would do automatic pop ups which can really annoying 

        so that is why we use local storage
        */
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3() //but since it exists, it will keep calling enableWeb3 if we are disconnected, so we can add another useeffect that checks if
                //the user has disconnected
            }
        }
    }, [isWeb3Enabled])
    //SECOND paramter is a dependency array --> whenever states in that array changes, it will call that function we pass in and re-render
    //if we have a blank array --> it will only run on load

    //we run this whenever an account has changed
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected") //once we remove it , and deacvtivate, web3enabled --> false, the other use effect will run, but it will
                //find no connected item in storage --> so no pop up will be pop
                deactivateWeb3() //set is web3 enabled to false

                console.log("null account found")
            }
        })
    }, [])
    return (
        <div>
            {account ? (
                <div>
                    connected to {account.slice(0, 6)}...{account.slice(account.length - 4)}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined")
                            window.localStorage.setItem("connected", "injected")
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    connect
                </button>
            )}
        </div>
    )
}
//we use enableWEb 3 --> have out onclick call enable web3
//going to use the react moralis ---> to download it --> yarn add react react-dom moralis react-moralis
//why didn't we do yarn add --dev?  becuase this is not for backend --> for backend , we add everything to dev...
