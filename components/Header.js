//now we have the manual version, this is the cheat way
//we will use the web3  kit
//yarn add web3uikit
import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="border-b-2">
            <ConnectButton moralisAuth={false} />
        </div>
    )
}
