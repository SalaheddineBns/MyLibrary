class ReviewModel {
    id: number;
    userEmail: string;
    date: Date;
    rating: number;
    book_id: number;
    reviewDescription: string;

    constructor(id: number, user_email: string, date: Date, rating: number, book_id: number, review_description: string) {
        this.id = id;
        this.userEmail = user_email;
        this.date = date;
        this.rating = rating;
        this.book_id = book_id;
        this.reviewDescription = review_description
    }
}


export default ReviewModel