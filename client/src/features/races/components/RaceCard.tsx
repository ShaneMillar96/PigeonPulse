import React from 'react';
import { Link } from 'react-router-dom';
import { FaFlag, FaShoppingBasket, FaTrophy, FaTachometerAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { Button } from '@/components';
import { Race } from '../';

interface RaceCardProps {
    race: Race;
    onDelete: (raceId: number) => void;
}

export function RaceCard({ race, onDelete }: RaceCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
            <div>
                <h2 className="text-2xl font-semibold">{race.name}</h2>
                <p className="text-gray-600">Date: {new Date(race.date).toLocaleDateString()}</p>
                <p className="text-gray-600">Distance: {race.distance} km</p>

                {/* Status Badge */}
                <div className="mt-2">
          <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  race.raceStatus.name === 'New'
                      ? 'bg-gray-200 text-gray-800'
                      : race.raceStatus.name === 'Basketed'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
              }`}
          >
            {race.raceStatus.name}
              {race.raceStatus.name === 'New' && <FaFlag className="ml-2" />}
              {race.raceStatus.name === 'Basketed' && <FaShoppingBasket className="ml-2" />}
              {race.raceStatus.name === 'Finished' && <FaTrophy className="ml-2" />}
          </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4">
                <Link to={`/edit-race/${race.id}`}>
                    <Button variant="icon" className="text-blue-500 hover:text-blue-700">
                        <FaEdit size={20} />
                    </Button>
                </Link>
                <Button
                    variant="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(race.id)}
                >
                    <FaTrash size={20} />
                </Button>

                {race.raceStatus.name === 'New' && (
                    <Link to={`/race/${race.id}/basket`}>
                        <Button variant="icon" className="text-yellow-500 hover:text-yellow-700">
                            <FaShoppingBasket size={20} />
                        </Button>
                    </Link>
                )}
                {race.raceStatus.name === 'Basketed' && (
                    <Link to={`/race/${race.id}/results`}>
                        <Button variant="icon" className="text-green-500 hover:text-green-700">
                            <FaTachometerAlt size={20} />
                        </Button>
                    </Link>
                )}
                {race.raceStatus.name === 'Finished' && (
                    <Link to={`/race/${race.id}/leaderboard`}>
                        <Button variant="icon" className="text-purple-500 hover:text-purple-700">
                            <FaTrophy size={20} />
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}