'use client';
import Button from '@/app/components/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/userSlice';
import { checkIsLogged } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function Menu() {
    const dispatch = useDispatch();
    const router = useRouter();
    const userState = useSelector((state: RootState) => state.user.current);
    const isLoggedIn = checkIsLogged(userState);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear user state regardless of server response
            dispatch(logout());
            router.push('/');
        }
    };

    return <div className="container items-center flex-col md:flex-row flex justify-center space-y-2 md:space-y-0 md:space-x-4">
        <Button onClick={() => window.location.href = "/"} >Home</Button>
        <Button onClick={() => window.location.href = "/books"} >Catalogo</Button>
        <Button onClick={() => window.location.href = "/user"} >La mia libreria</Button>
        {isLoggedIn && (
            <Button onClick={handleLogout}>Logout</Button>
        )}
    </div>;
}