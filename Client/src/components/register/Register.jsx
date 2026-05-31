import { useState, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axiosClient from '../../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../../assets/MagicStreamLogo.png';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [genres, setGenres] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenreChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        setFavouriteGenres(options.map(opt => ({
            genre_id: Number(opt.value),
            genre_name: opt.label
        })));
    };
   const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const defaultRole ="USER";

        console.log(defaultRole);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email,
                password,
                role: defaultRole,
                favourite_genres: favouriteGenres
            };
            const response = await axiosClient.post('/register', payload);
            if (response.data.error) {
                setError(response.data.error);
                return;
            }
            // Registration successful, redirect to login
            navigate('/login', { replace: true });
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchGenres = async () => {
        try {
            const response = await axiosClient.get('/genres');
            setGenres(response.data);
        } catch (error) {
            console.error('Error fetching movie genres:', error);
        }
        };
    
        fetchGenres();
    }, []);


    return (
       <Container className="login-container d-flex align-items-center justify-content-center min-vh-100">
            <div className="login-card shadow p-4 rounded bg-white" style={{maxWidth: 450, width: '100%'}}>
                <div className="text-center mb-4">
                     <img src={logo} alt="Logo" width={60} className="mb-2" />
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-muted small">Join Magic Stream and start watching.</p>
                    {error && <div className="alert alert-danger py-2">{error}</div>}                
                </div>
             <Form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>

                     <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Confirm</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                    isInvalid ={!!confirmPassword && password !== confirmPassword}
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <Form.Group className="mb-4">
                        <Form.Label>Favourite Genres</Form.Label>
                        <Form.Select
                            multiple
                            value={favouriteGenres.map(g => String(g.genre_id))}
                            onChange={handleGenreChange}
                            className="bg-light"
                        >
                            {genres && genres.map(genre => (
                                <option key={genre.genre_id} value={genre.genre_id} label={genre.genre_name}>
                                    {genre.genre_name}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted x-small">
                            Hold Ctrl/Cmd to select multiple.
                        </Form.Text>
                    </Form.Group>

                     <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mb-3 py-2"
                        disabled={loading}
                        style={{fontWeight: 700, letterSpacing: 1}}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Registering...
                            </>
                        ) : 'REGISTER NOW'}
                    </Button>    

                    <div className="text-center small">
                        Already have an account? <Link to="/login" className="text-info text-decoration-none fw-bold">Login here</Link>
                    </div>                    
            </Form>
            </div>           
       </Container>
    )
}
export default Register;