import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useEffect, useState} from 'react';
import Movies from '../movies/Movies';
import Spinner from '../spinner/Spinner';

const Recommended = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchRecommendedMovies = async () => {
            setLoading(true);
            setMessage("");

            try{
                const response = await axiosPrivate.get('/recommendedmovies');
                setMovies(response.data);
                if (!response.data || response.data.length === 0) {
                    setMessage("We don't have any recommendations for you yet. Try adding more genres to your profile!");
                }
            } catch (error){
                console.error("Error fetching recommended movies:", error)
            } finally {
                setLoading(false);
            }

        }
        fetchRecommendedMovies();
    }, [])

    return (
        <div className="container mt-4">
            <h2 className="section-title">Recommended For You</h2>
            {loading ? (
                <Spinner/>
            ) :(
                <Movies movies = {movies} message ={message} />
            )}
        </div>
    )

}
export default Recommended