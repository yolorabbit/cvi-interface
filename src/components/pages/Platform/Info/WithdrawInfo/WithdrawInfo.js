import React from 'react'
import { useActionController } from '../../Actions/ActionController';
import './WithdrawInfo.scss';

const WithdrawInfo = () => {
    const { token, amount } = useActionController();

    return (
        <div className="withdraw-info-component">
            <span>You will send 567,654,565,555.111654654221 LP and receive {amount || 0} {token?.toUpperCase()}</span>
        </div>
    )
}

export default WithdrawInfo;