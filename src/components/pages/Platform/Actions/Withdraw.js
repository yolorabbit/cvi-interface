import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'

const Withdraw = () => {
    return (
        <div className="withdraw-component">
            <div className="withdraw-component__container">
                <Countdown />
                <Button className="withdraw-component__container--button" buttonText="Withdraw" onClick={() => {}} />
            </div>
        </div>
    )
}

export default Withdraw;