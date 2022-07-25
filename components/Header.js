//now we have the manual version, this is the cheat way
//we will use the web3  kit
//yarn add web3uikit
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-flog text-3xl">Decentralized Lottery</h1>
            <div className="ml-auto py-2 px-2">
                {/* margin-left: auto will give 
                    the html element the remaining space to the left
                    therefore putting it on the very right, 
                    if we combine with margin-right:auto --> center */}
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}

/*
    nextJs can be used to create static websites 

    run yarn build --> for production build 

    yarn next export --> but will probably fail if it has non - static stuff --> Export next.js sites to be served statically. By default this outputs to a sites directory in the root of your project.

*/
