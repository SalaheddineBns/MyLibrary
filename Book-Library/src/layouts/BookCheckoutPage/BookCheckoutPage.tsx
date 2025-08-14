import { useOktaAuth } from "@okta/okta-react";
import { url } from "inspector";
import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import ReviewModel from "../../models/ReviewModel";
import ReviewRequestModel from "../../models/ReviewRequestModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBook";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState(null)

    //Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true)

    const [isReviewLeft, setIsReviewLeft] = useState(false)
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true)
    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0) //0 for the default without authentication
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true)
    //Is Book Checked Out ?
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true)

    const [displayError, setDisplayError] = useState(false)

    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: RequestInfo = `${process.env.REACT_APP_API}/books/${bookId}`;
            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error("Something Went Wrong");
            }

            const responseJson = await response.json();


            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            console.log(loadedBook);



            setBook(loadedBook);
            setIsLoading(false);

        };
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [isCheckedOut])

    useEffect(() => {
        const fetchBookReviews = async () => {
            const reviewUrl: string = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`
            const response = await fetch(reviewUrl)
            if (!response.ok) {
                throw new Error('Something went wrong')
            }
            const responseJsonReviews = await response.json();
            const responseData = responseJsonReviews._embedded.reviews;
            const loadedReviews: ReviewModel[] = []
            let weightedStarReviews: number = 0;
            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    userEmail: responseData[key].userEmail,
                    date: responseData[key].date,
                    rating: responseData[key].rating,
                    book_id: responseData[key].bookId,
                    reviewDescription: responseData[key].reviewDescription,
                });
                weightedStarReviews += responseData[key].rating
            }
            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2 / 2).toFixed(1))
                setTotalStars(Number(round))
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);

        };

        fetchBookReviews().catch((error: any) => {
            setIsLoadingReview(false)
            setHttpError(error.message)
        })

    }, [isReviewLeft])

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/reviews/secure/user/book/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'content-type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                console.log(userReview);// all the response promise

                if (!userReview.ok) {
                    throw new Error('Something went wrong');
                }
                const userReviewResponseJson = await userReview.json();
                console.log(userReviewResponseJson);
                setIsReviewLeft(userReviewResponseJson);

            }
            setIsLoadingUserReview(false);

        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState])

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error('Something went Wrong!');
                }
                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }
            setIsLoadingCurrentLoansCount(false)

        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message)
        });
    }, [authState, isCheckedOut])

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${process.env.REACT_APP_API}/books/secure/ischeckout/byuser/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong')
                }
                const bookCheckedOutResponseJson = await bookCheckedOut.json()
                setIsCheckedOut(bookCheckedOutResponseJson)
            }
            setIsLoadingBookCheckedOut(false)
        }

        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false)
            setHttpError(error.message);
        })
    }, [authState])



    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = `${process.env.REACT_APP_API}/books/secure/checkout/?bookId=${bookId}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions)
        if (!checkoutResponse.ok) {
            setDisplayError(true)
            throw new Error("Something went wrong")
        }
        setDisplayError(false)
        setIsCheckedOut(true)
    }
    async function submitReview(startInput: number, reviewDescription: String) {
        let bookId: number = 0;
        if (book?.id) {
            bookId = book.id;
        }
        const reviewRequestModel = new ReviewRequestModel(startInput, bookId, reviewDescription);
        const url = `${process.env.REACT_APP_API}/reviews/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,//question
                'Content-type': 'application/json'
            },
            body: JSON.stringify(reviewRequestModel)
        };
        const returnResponse = await fetch(url, requestOptions)
        if (!returnResponse.ok) {
            throw new Error('Something Went Wrong')
        }
        setIsReviewLeft(true)// apres tout est bien donc il a fait review
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                {displayError && <div className="alert alert-danger mt-3" role='alert'>
                    please pay outstanding fees and /or return late book(s)
                </div>}
                <div className="row mt-5">
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={4} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currenLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            <div className='container d-lg-none mt-5'>
                {displayError && <div className="alert alert-danger mt-3" role='alert'>
                    please pay outstanding fees and /or return late book(s)
                </div>}
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currenLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
        </div>
    );
}