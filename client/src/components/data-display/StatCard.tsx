import React from "react";

export const StatCard = ({ icon, title, text }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="text-4xl mr-4">{icon}</div>
        <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-gray-600">{text}</p>
        </div>
    </div>
);


