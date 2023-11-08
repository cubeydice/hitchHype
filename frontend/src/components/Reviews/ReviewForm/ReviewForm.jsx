const ReviewForm = () => {

    const handleChange = (field) => (e) => {
        e.preventDefault();

        switch (field) {
            case '':

                break;

            default:
                break;
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

    }

    return (
        <>
        <form onSubmit={handleSubmit}>
        <label>
            <h3>Title</h3>
            <input type="text"></input>
        </label>
        <label>
            <h3>Body</h3>
            <input type="text"></input>
        </label>
        <label>
            <h3>Rating</h3>
            <input type="text"></input>
        </label>
        </form>
        </>
    )
}

export default ReviewForm;