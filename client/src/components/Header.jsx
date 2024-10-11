import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import scorezyLogo from '../assets/scorezy.png';

const ADMIN_PROFILE_PIC_URL = 'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2264922221.jpg';

export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    // Determine profile picture URL
    const profilePicUrl = currentUser?.isAdmin ? ADMIN_PROFILE_PIC_URL : currentUser?.profilePicture;

    // Check if the current route is /exam-builder
    const isExamBuilder = location.pathname.startsWith('/exam-builder'); // Modified to handle sub-routes

    // Get the exam name from the URL
    const examName = new URLSearchParams(location.search).get('examName');

    return (
        <div className='bg-cyan-600 bg-opacity-70 h-20 fixed top-0 left-0 right-0 z-10 transition-colors duration-300 hover:bg-cyan-500 hover:bg-opacity-80'>
            <div className='flex justify-between items-center mx-auto'>
                <Link to='/'>
                    <img src={scorezyLogo} className='w-40 ml-6' />
                </Link>
                <ul className='flex gap-12 items-end p-3'>
                    {!isExamBuilder && (
                        <>
                            <Link to='/'>
                                <button className='button'>
                                    <li>Home</li>
                                </button>
                            </Link>
                            <Link to='/about'>
                                <button className='button'>
                                    <li>About</li>
                                </button>
                            </Link>
                        </>
                    )}
                    {isExamBuilder && (
                        <div className='flex gap-4'>
                            <Link to={`/converter?examName=${encodeURIComponent(examName)}`}>
                                <button className='button'>
                                    <li>Upload Paper</li>
                                </button>
                            </Link>
                            <button className='button'>
                                <li>Save Paper</li>
                            </button>
                        </div>
                    )}

                    <Link to='/profile'>
                        <button className='bg-sky-800 w-13 h-13 rounded-3xl p-1 hover:bg-cyan-600 hover:shadow-cyan-800/50 hover:font-bold transition transform hover:-translate-y-1 hover:scale-105'>
                            {currentUser ? (
                                <img src={profilePicUrl} alt='profile' className='h-10 w-10 rounded-full object-cover' />
                            ) : (
                                <li className='button'>Sign In</li>
                            )}
                        </button>
                    </Link>
                </ul>
            </div>
        </div>
    );
}