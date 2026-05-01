import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";
import { useAuth0 } from "@auth0/auth0-react";


export const CheckoutAndReviewBook: React.FC<{
    book: BookModel | undefined, mobile: boolean, currentLoansCount: number,
    isAuthenticated: any, isCheckedOut: boolean, checkoutBook: any, isReviewLeft: Boolean,
    submitReview: any, checkoutError: string | null
}> = (props) => {

    const { loginWithRedirect } = useAuth0();

    const renderButton = () => {

        if (props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount < 5) {
                return <button onClick={() => props.checkoutBook()} className="btn btn-success btn-lg">Checkout</button>
            }
            else if (props.isCheckedOut) {
                return (<p><b>Book checked out. Enjoy!</b></p>)
            }
            else if (!props.isCheckedOut) {
                return (<p className="text-danger">Too many books checked out.</p>)
            }
        }
        return (<button onClick={() => loginWithRedirect()} className="btn btn-success btn-lg">Sign in</button>)
    }

    function reviewRender() {
        if (props.isAuthenticated && !props.isReviewLeft) {
            return (
                <div><LeaveAReview submitReview={props.submitReview}/></div>
            )
        } else if (props.isAuthenticated && props.isReviewLeft) {
            return (
                <p><b> Thank you for your review</b></p>
            )
        }
        return (<div><hr /><p>Sign in to be able to leave a review. </p></div>)
    }



    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className='text-success'>
                            Available
                        </h4>
                        :
                        <h4 className='text-danger'>
                            Wait List
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {renderButton()}
                {props.checkoutError &&
                    <div className='alert alert-danger mt-2' role='alert'>
                        {props.checkoutError}
                    </div>
                }
                <hr />
               
                <p className='mt-3'>
                    This number can change until placing order has been complete.
                </p>
                  {reviewRender()}
            </div>
        </div>
    );
}