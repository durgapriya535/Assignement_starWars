import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Create this file for styling

const App = () => {
  const [planets, setPlanets] = useState([]);
  const [loading,setLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);

  useEffect(() => {
    fetchPlanets('https://swapi.dev/api/planets/?format=json');
  },[] );

  const fetchPlanets = async (planeturl) => {
    renderLoading();
    try {
      const response = await axios.get(planeturl);
      const data = await response.data;
      setNextPage(response.data.next);

      const planetWithResidents = await Promise.all(
        data.results.map(async (planet) => {
            const residents = await Promise.all(
                planet.residents.map(async (url) =>{
                    const response = await axios.get(url);
                    return await response.data;
                })
            );
            return {...planet, residents};
        })
      );
      setPlanets(pastPlanets => [...pastPlanets, ...planetWithResidents]);
    } catch (error) {
      console.error('Error fetching planets:', error);
    } finally {
        setLoading(false);
    }
  };

//   const fetchResidents = async (planet) => {  
//     for (const url of planet.residents) {
//         const abc = planetRes;
//         console.log(planet.name, url);

//       try {
//         const response = await axios.get(url);
//         const responseData = response.data;
  
//         if (response.status === 200) {
//             abc[planet] = responseData;
//             setPlanetRes(abc);
//         } else {
//           console.error('Invalid resident response:', responseData);
//         }
//       } catch (error) {
//         console.error('Error fetching resident:', error);
//       }
//     }
  
//     console.log('Residents:', planet.residentObjs);
//   };
  const handleLoadMore = () => {
    if (nextPage) {
    setLoading(true);
      fetchPlanets(nextPage);
    }
  };

  const renderResident = (resident) => {
    return (
        <li key={resident.url}>
          {renderGender(resident.gender)} {resident.name}{renderHeight(resident.height)}{renderMass(resident.mass)}
        </li>
    )
  }

  const  renderHeight = (height) => {
    if (height === "unknown"){
        return  null;
    }
    else {
        return (<span>, {height} cms</span>)
    };
  }
  const renderMass = (mass) => {
    if (mass === "unknown"){
        return null;
    }
    else return (<span>, {mass} kgs</span>);
  }
  const renderGender=(gender)=>{
    var imgsrc = "female.png";
    if (gender === 'male') {
        imgsrc = "male.png";
    }
    return (
        <img src={imgsrc} alt="male" width="15"/>
    );
  }
  const renderLoading = () =>{
    if(loading){
        return (
            <div>
                <img src="loading.gif" alt="Loading..."/>
            </div>
        )
      }else{
        return (
        <button onClick={handleLoadMore} disabled={!nextPage}>
            Load More
        </button>
        )
      }  
  }
  
  return (
    <div className="app">
      <h1 className="header"> Star Wars Planets</h1>
      <div className="planets">
        {planets.map((planet) => (
          <div key={planet.url} className="planet-card col-4">
            <h2>{planet.name}</h2>
            <p>Climate: {planet.climate}</p>
            <p>Population: {planet.population}</p>
            <p>Terrain: {planet.terrain}</p>
            
            {planet.residents.length > 0 ? (
                <div>
                <h3>Residents ({planet.residents.length})</h3>
                <ul  className="no-bullets">
                    {planet.residents.map((resident) => (
                    renderResident(resident)
                    ))}
                </ul>
                </div>
              ) : (
                <h3>No residents</h3>
              )}
          </div>
        ))}
      </div>
      {renderLoading()}
      
    </div>
  );
};

export default App;