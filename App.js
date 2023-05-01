import React, { useState, useEffect } from 'react';
import './App.css';

const CLIENT_ID = 'bc19e20316de489ba87ca01f6c7c4e52';
const CLIENT_SECRET = '4e9b382f566141faa20a2eb3587844bf';

const RenderTracks = (props) => {
  const [accessToken, setAccessToken] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    async function fetchAccessToken() {
      var authParam = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
      }

      const response = await fetch('https://accounts.spotify.com/api/token', authParam);
      const data = await response.json();
      setAccessToken(data.access_token);
    } fetchAccessToken();
  }, []);

  useEffect(() => {
    async function search() {
      var artistParam = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        }
      }

      const response = await fetch('https://api.spotify.com/v1/search?q=' + props.search + '&type=track', artistParam);
      const data = await response.json();
      setSearchResult(data.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: [item.album.name, item.album.release_date, item.album.external_urls.spotify],
        image: item.album.images[0].url,
        hyperlink: item.external_urls.spotify,
        musicDemo: item.preview_url
      })));
    } search();
  }, [accessToken, props.search]);

  return (
    <div className='mx-2 row row-cols-3'>
      {searchResult.map((e) => {
        return (
          <div class="card border-0 m-4 rounded" style={{ width: 19.5 + "rem", backgroundColor: "#28282B"}}>
            <a href={e.hyperlink} target='_blank' rel='noreferrer'>
              <img class="card-img-top" src={e.image} alt=""/>
            </a>
            <div class="card-body">
              <h4 class="card-title">{e.name}</h4>
              <p class="card-text">
                Artist: <b>{e.artist}</b> <br />
                Album: <b>{e.album[0]}</b> <br /> <br />
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const App = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className='container-lg m-5'>
      <input className="form-control form-control-lg w-75 mx-auto" type="text" placeholder="Search Music" onChange={(ev) => setSearchInput(ev.target.value)} />
      <br />
      <RenderTracks search={searchInput} />
    </div>
  )
}
export default App;
