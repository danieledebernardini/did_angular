# DiD on XRPL

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.5.

## Main objective

In the digital world we are often required to prove our identity in order to get access to a specific online service, and this is usually done with either the combination email + password, or via Single Sign On (SSO) methods. With our project we would like to provide an alternative method of online authentication, exploiting the blockchain properties in order to get identity verification, security and scalability.

## Brief description

This project consists in producing a mock-up implementation of a DiD service. Visiting our splash page, a user is allowed to create a decentralized identifier by filling in a form with their data. Following the DiD specifications, our service then securely commits the data to the blockchain (to use it as a Verifiable Registry) via a suitable transaction. From this moment onwards, the user will be able to require a Verifiable Claim (VC) of their DiD.
This service also act as a simple Service Provider, allowing the user to test the Verifiable Claim against a verification proof. In this phase, the DiD service will return the follow the specified cryptographic protocol to perform the verification.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.