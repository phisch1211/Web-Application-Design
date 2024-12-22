import React from "react";
import Button from 'react-bootstrap/Button';
import axios from 'axios';



const UserProfile = () => {

    // Handle logout
    const handleLogout = async () => {
        try {
            // Call your API endpoint for logging out (if necessary)
            await axios.delete('http://localhost:3000/api/user',  {
                headers: {
                    'token': localStorage.getItem('token')
                }
            });
            // Clear user session
            localStorage.removeItem('token');
            localStorage.removeItem('userID');
            window.location.href = "./login";
            // Redirect to login or homepage
        } catch (error) {
            console.error("Logout error", error);
            // Handle error (e.g., show an alert or notification)
        }
    };

    // Handle account deletion
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account?");
        if (confirmDelete) {
            try {
                // Call your API endpoint for deleting the account
                await axios.delete('http://localhost:3000/api/account', {
                    headers: {
                        'token': localStorage.getItem('token')
                    }
                });
                // Clear user session after deletion
                localStorage.removeItem('token');
                localStorage.removeItem('userID');
                window.location.href = "./login";
                // Redirect to homepage or login after deletion
            } catch (error) {
                console.error("Delete account error", error);
                // Handle error (e.g., show an alert or notification)
            }
        }
    };

    return (
        <div className="d-flex gap-2 mb-2">
            <Button variant="primary" size="lg" onClick={handleLogout}>
                Log-out
            </Button>
            <Button variant="secondary" size="lg" onClick={handleDeleteAccount}>
                Delete account
            </Button>
        </div>
    );
};

export default UserProfile;