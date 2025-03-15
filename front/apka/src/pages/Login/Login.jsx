import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import httpClient from '../../utils/axiosInstance'; // Zaktualizowany import

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Proszę wprowadzić poprawny address email.");
            return;
        }
      
        if (!password) {
            setError("Proszę wprowadź hasło!");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            // Użycie nowego klienta HTTP
            const response = await httpClient.post("/login", {
                email: email,
                password: password,
            });

            if (response.data && response.data.accessToken) {
                localStorage.setItem("token", response.data.accessToken);
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Spróbuj ponownie!");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className='flex items-center justify-center mt-28'>
                <div className='w-98 border rounded bg-white px-7 py-10'>
                    <form onSubmit={handleLogin}>
                        <h4 className='text-2xl mb-7'>Login</h4>

                        <input 
                            type="text" 
                            placeholder='Email' 
                            className='input-box'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />

                        {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

                        <button 
                            type="submit" 
                            className='btn-primary'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logowanie...' : 'Login'}
                        </button>

                        <p className='text-sm text-center mt-4'>
                            Nie zarejestrowano jeszcze? {" "}
                            <Link to="/signUp" className="font-medium text-primary underline">
                                Utwórz Konto
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;