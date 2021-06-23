import { Withdraw } from "components/pages/Platform/Actions"
import { Pnl } from "../Values/Pnl"
import { Value } from "../Values/Value"

export const LiquidityRow = ({token}) => {
    return <tr>
        <td>
            <img src={require(`../../../../../../images/coins/${token}.svg`).default} alt={token} />
        </td>

        <td> <Value text="450,508.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> </td>

        <td>
            <Pnl value="88,158.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> 
        </td>

        <td>
            <Value text="768.20820509" subText={token?.toUpperCase()} />
        </td>

        <td><Withdraw /></td>
    </tr>
}