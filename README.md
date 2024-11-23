# Document Verification System

## Overview
The **Document Verification System** is a backend service for securely handling document uploads, issuing digital certificates, and verifying documents using IPFS, Google AI OCR, and MongoDB. This project ensures decentralized storage and tamper-proof verification for various document types.

---

## Features
1. **Document Upload**  
   - Upload documents by individuals or organizations.  
   - Store documents on IPFS for decentralized, secure storage.  
   - Save document metadata in MongoDB.

2. **Digital Certificate Issuance**  
   - Generate and issue unique digital certificates for documents.  
   - Digitally sign certificates for authenticity.  
   - Link certificates to uploaded documents.

3. **Document Verification**  
   - Extract text from uploaded documents using Google Vision API (OCR).  
   - Match extracted text with dummy data for validation.  
   - Verify document integrity and authenticity using IPFS hash and digital signatures.

---

## Tech Stack
- **Backend Framework:** Express.js  
- **Database:** MongoDB  
- **Decentralized Storage:** IPFS (Infura Gateway)  
- **OCR and AI Services:** Google Vision API  
- **Authentication (Future Scope):** JWT  

---

## Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/)
- IPFS (via [Infura](https://infura.io/))
- Google Cloud Account with Vision API enabled

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/document-verification-system.git
   cd document-verification-system
   ```
   2. **Install Dependencies**:
   ```
   npm install
   ```

