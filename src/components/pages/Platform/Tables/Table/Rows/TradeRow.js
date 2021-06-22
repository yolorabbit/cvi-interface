import { Claim, Sell } from "components/pages/Platform/Actions"
import { Pnl } from "../Values/Pnl"
import { Value } from "../Values/Value"

export const TradeRow = ({token}) => {
    return <tr>
        <td>
            <div>
                <img src={require(`../../../../../../images/coins/${token}.svg`).default} alt={token} />
            </div>
        </td>

        <td> <Value text="8.45637366" subText={`${token?.toUpperCase()} (0.03%)`} /> </td>

        <td>
            <Pnl value="1.30024285" token={`${token?.toUpperCase()}`} precents={5.6} /> 
        </td>

        <td>
            <Claim />
        </td>

        <td>
            <Value text="X1" />
        </td>

        <td>
            <Value text="22.06.2021" />
        </td>

        <td><Sell /></td>
    </tr>
}