import React from 'react';

const Loading = ({ show }) => {
    return show && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <div
                className="h-16 w-16 animate-spin rounded-full border-8 border-solid border-blue-500 border-r-transparent"
                role="status">
                <span
                    className="sr-only"
                >Loading...</span>
            </div>
        </div>
    );
}

export default Loading;
