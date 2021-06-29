import { useActionController } from 'components/Actions/ActionController';
import React from 'react'
import './WithdrawInfo.scss';

const WithdrawInfo = () => {
    const { token, amount } = useActionController();

    return (
        <div className="withdraw-info-component">
            <span>You will send 567,654.111 LP and receive {amount || 0} {token?.toUpperCase()}</span>
        </div>
    )
}

export default WithdrawInfo;