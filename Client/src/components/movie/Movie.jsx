import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCirclePlay} from '@fortawesome/free-solid-svg-icons';
import "./Movie.css";
const Movie = ({movie,updateMovieReview}) => {
    return (
        <div className="col-md-4 mb-4" key={movie._id}>
            <Link
                to={`/stream/${movie.youtube_id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <div className="card h-100 shadow-sm movie-card">
                <div style={{position:"relative", overflow: 'hidden'}}>
                    <img src={movie.poster_path} alt={movie.title} 
                        className="card-img-top"
                        style={{
                            objectFit: "cover",
                            height: "280px",
                            width: "100%",
                            display: "block"
                        }}
                    />
                    <span className="play-icon-overlay">
                            <FontAwesomeIcon icon={faCirclePlay} />
                    </span>
                </div>
                <div className = "card-body d-flex flex-column movie-card-info">
                    <h5 className ="card-title">{movie.title}</h5>
                    <p className="card-text mb-0">{movie.imdb_id}</p>
                </div>
                {movie.ranking?.ranking_name && (
                    <div className="px-3 pb-2">
                        <span className="badge bg-dark">
                            {movie.ranking.ranking_name}
                        </span>
                    </div>
                )}
                  {updateMovieReview && (
                        <Button
                            variant="outline-info"
                            onClick={e => {
                                e.preventDefault();
                                updateMovieReview(movie.imdb_id);
                            }}
                        >
                            Review
                        </Button>
                    )}
            </div>
            </Link>
        </div>
    )
}
export default Movie;