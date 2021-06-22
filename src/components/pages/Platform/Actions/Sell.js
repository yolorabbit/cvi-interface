import Countdown from 'components/Countdown/Countdown';
import Button from 'components/Elements/Button';
import React from 'react'

const Sell = () => {
    return (
        <div className="sell-component">
            <div className="sell-component__container">
                <Countdown />
                <Button className="sell-component__container--button" buttonText="Sell" onClick={() => {}} />
            </div>
        </div>
    )
}

export default Sell;