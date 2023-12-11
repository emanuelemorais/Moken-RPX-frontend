# Moken: Airbnb on Blockchain

Welcome to the Moken project repository! Moken is a decentralized platform that brings the concept of Airbnb to the blockchain, utilizing XRP Ripple technology. Users can add properties for rent, explore available rentals, and seamlessly transact using the power of blockchain. This README provides instructions on how to set up and run the frontend of the Moken project for the XRP Ripple hackathon.

## Getting Started

Follow the steps below to get the Moken frontend up and running on your local machine.

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js and npm

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/moken-frontend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd moken-frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root of the project.

2. Add the following environment variables to the `.env` file:

   ```env
   NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
   ```

   Replace `your_pinata_jwt_token` with your actual Pinata JWT token for IPFS integration.

### Running the Frontend

Once you've completed the installation and configuration, you can run the Moken frontend with the following command:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser to access the Moken platform.

## Features

### Add Properties for Rent

- Click on the "Add property" button to add a new property for rent.
- Fill in the details, including type, address, bedrooms, size, and price.
- Upload an image for the property.

### Explore Rentals

- Browse through the available properties for rent.
- View property details and images.

### Rent Properties

- Click on a property to initiate the rental process.

### QR Code Access

- Upon successful rental, a QR code will be used to unlock and access the rented property.

## Technologies Used

- React/Next.js
- Ethereum Smart Contracts
- XRP Ripple
- IPFS for decentralized file storage

## License

This project is licensed under the [MIT License](LICENSE.md).

Happy renting with Moken! 🏠🌐
