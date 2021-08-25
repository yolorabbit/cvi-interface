import React from 'react';
import Container from 'components/Layout/Container';

//TODO: create a dedicated css data - right now taken from staking component
import '../Staking/Staking.scss';

//TODO: better styling of error component
export const Error = ({message}) => {
  <Container title="Error occured" style={{background: 'red', text: 'white'}}>
    {message}
  </Container>
};

//TODO: better styling of loading component
export const Loading = () => <Container>Loading...</Container>;
