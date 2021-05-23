import { Switch, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import BikeGallery from './Components/BikeGallery/BikeGallery';
import BikeProfile from './Components/BikePage/BikePage';
import MarketGallery from './Components/MarketGallery/MarketGallery';
import ClassifiedPage from './Components/ClassifiedPage/ClassifiedPage';


export default (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/builds/page/:page' component={BikeGallery} />
        <Route exact path='/builds/:bikeId' component={BikeProfile} />
        <Route exact path='/market' component={MarketGallery} />
        <Route exact path='/market/:classifiedId' component={ClassifiedPage} />
        {/* classified */}
        {/* classifiedProfile */}
        {/* userProfile */}
    </Switch>
)