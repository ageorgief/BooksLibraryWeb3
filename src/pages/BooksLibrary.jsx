import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useSigner } from 'wagmi';
import booksLibraryAbi from '../abi/BooksLibrary.json';
import Button from '../components/ui/Button';

const BooksLibrary = () => {
  const { data: signer } = useSigner();
  const contractAddress = '0x29c7DA5e258E1bAc4E203a9f1127D7f279591F05';

  const initialAddBookFormData = {
    author: '',
    title: '',
    copies: 0,
  };

  const initialRentBookFormData = {
    bookId: '',
  };

  const initialReturnBookFormData = {
    bookId: '',
  };

  // Contract states
  const [contract, setContract] = useState();

  // Form states
  const [addBookFormData, setAddBookFormData] = useState(initialAddBookFormData);
  const [rentBookFormData, setRentBookFormData] = useState(initialRentBookFormData);
  const [returnBookFormData, setReturnBookFormData] = useState(initialReturnBookFormData);
  const [availableBooks, setAvailableBooks] = useState([]);

  const [isLoadingAddBook, setIsLoadingAddBook] = useState(false);
  const [isLoadingRentBook, setIsLoadingRentBook] = useState(false);
  const [isLoadingReturnBook, setIsLoadingReturnBook] = useState(false);
  const [isLoadingShowBook, setIsLoadingShowBook] = useState(false);

  const [formSubmitError, setFormSubmitError] = useState('');

  // Handlers
  const handleAddBookFormInputChange = e => {
    const { value, name } = e.target;

    setAddBookFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRentBookFormInputChange = e => {
    const { value, name } = e.target;

    setRentBookFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReturnBookFormInputChange = e => {
    const { value, name } = e.target;

    setReturnBookFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddBookButtonClick = async () => {
    setIsLoadingAddBook(true);
    setFormSubmitError('');

    try {
      const { author, title, copies } = addBookFormData;

      const tx = await contract.addBook(author, title, copies);
      await tx.wait();

      setAddBookFormData(initialAddBookFormData);

    } catch (e) {
      setFormSubmitError(e.reason);
    } finally {
      setIsLoadingAddBook(false);
    }
  };

  const handleRentBookButtonClick = async () => {
    setIsLoadingRentBook(true);
    setFormSubmitError('');

    try {
      const { bookId } = rentBookFormData;

      const tx = await contract.borrowBook(bookId);
      await tx.wait();

      setRentBookFormData(initialRentBookFormData);

    } catch (e) {
      setFormSubmitError(e.reason);
    } finally {
      setIsLoadingRentBook(false);
    }
  };

  const handleReturnBookButtonClick = async () => {
    setIsLoadingReturnBook(true);
    setFormSubmitError('');

    try {
      const { bookId } = returnBookFormData;

      const tx = await contract.returnBook(bookId);
      await tx.wait();

      setReturnBookFormData(initialReturnBookFormData);

    } catch (e) {
      setFormSubmitError(e.reason);
    } finally {
      setIsLoadingReturnBook(false);
    }
  };

  const handleShowAvailableBooks = async () => {
    setIsLoadingShowBook(true);
    setFormSubmitError('');

    try {
      const books = await contract.getAllAvailableBooks();
      setAvailableBooks(books);

    } catch (e) {
      setFormSubmitError(e.reason);
    } finally {
      setIsLoadingShowBook(false);
    }
  };


  // Use effects
  useEffect(() => {
    if (signer) {
      const booksLibraryContract = new ethers.Contract(contractAddress, booksLibraryAbi, signer);

      setContract(booksLibraryContract);
    }
  }, [signer]);

  useEffect(() => {
    if (formSubmitError) {
      setFormSubmitError(formSubmitError);
    } else {
      setFormSubmitError('');
    }
  }, [formSubmitError]);

  return (
    <div className="container my-5 my-lg-10">
      <div className="row">
        <div className="col-6 offset-3">
          <h2 className="heading-medium text-center mb-5">Books Library</h2>
          <>
            <div className="card mt-5">
              <div className="card-body">
                <div className="form-group">
                  <p className="text-small text-bold">Author:</p>
                  <input
                    type="text"
                    className="form-control form-input-half"
                    name="author"
                    value={addBookFormData.author}
                    onChange={handleAddBookFormInputChange}
                  />
                </div>

                <div className="form-group">
                  <p className="text-small text-bold">Title:</p>
                  <input
                    type="text"
                    className="form-control form-input-half"
                    name="title"
                    value={addBookFormData.title}
                    onChange={handleAddBookFormInputChange}
                  />
                </div>

                <div className="form-group">
                  <p className="text-small text-bold">Number of copies:</p>
                  <input
                    type="text"
                    className="form-control form-input-half"
                    name="copies"
                    value={addBookFormData.copies}
                    onChange={handleAddBookFormInputChange}
                  />
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    onClick={handleAddBookButtonClick}
                    loading={isLoadingAddBook}
                    type="primary"
                  >
                    Add Book
                  </Button>
                </div>
              </div>
            </div>
            <div className="card mt-5">
              <div className="card-body">
                <div className="form-group">
                  <p className="text-small text-bold">Book ID:</p>
                  <input
                    type="text"
                    className="form-control"
                    name="bookId"
                    value={rentBookFormData.bookId}
                    onChange={handleRentBookFormInputChange}
                  />
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    onClick={handleRentBookButtonClick}
                    loading={isLoadingRentBook}
                    type="primary"
                  >
                    Rent book
                  </Button>
                </div>
              </div>
            </div>
            <div className="card mt-5">
              <div className="card-body">
                <div className="form-group">
                  <p className="text-small text-bold">Book ID:</p>
                  <input
                    type="text"
                    className="form-control form-input-half"
                    name="bookId"
                    value={returnBookFormData.bookId}
                    onChange={handleReturnBookFormInputChange}
                  />
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <Button
                    onClick={handleReturnBookButtonClick}
                    loading={isLoadingReturnBook}
                    type="primary"
                  >
                    Return book
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Button
                onClick={handleShowAvailableBooks}
                loading={isLoadingShowBook}
                type="primary"
              >
                Show available books
              </Button>
            </div>
            {availableBooks.length > 0 && (
              <div className="card mt-5">
                <div className="card-body">
                  <h4 className="mb-3">Available Books</h4>
                  <ul>
                    {availableBooks.map((book, index) => (
                      <li key={index}>{book}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </>

        </div>
      </div>
      {formSubmitError && (
        <div className="error-popup">
          <div className="error-popup-content">
            <div className="error-popup-message">{formSubmitError}</div>
            <button className="error-popup-close" onClick={() => setFormSubmitError('')}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksLibrary;