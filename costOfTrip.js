//loading the json files into variables
const interchanges = require('./interchanges.json').locations;
const rates = require('./rates.json').rates;
//const arguments =  process.argv.slice(2); //parsing line arguments

//checking initial load
//console.log(arguments);
//console.log(interchanges[init]);
//console.log(rates.rates.light);
console.log("--------------------------------");

//this function find the location id based on location name 
//and is used inside costOfTrip()
const findIdOfLocation = (locationName) => {
    for (const locId in interchanges) {
        if (interchanges[locId].name == locationName) {
            return locId;
        }
    }
};

//toll calculator based on distance
let costOfTrip = (initialPos, finalPos) => {
    if (initialPos != finalPos) {
        let distance = 0;
        //finding ids
        const init = findIdOfLocation(initialPos);
        const final = findIdOfLocation(finalPos);

        //looping through all objects in the interchanges array
        for (loc in interchanges) {
            //loc is string in the source
            //necessary double condition for dealing with both ways
            if (parseInt(loc) >= Math.min(init, final) &&
                parseInt(loc) < Math.max(init, final)) {
                //getting the distance of the route with a greater id than the current one
                distance += interchanges[loc].routes.filter(
                    r => r.toId > parseInt(loc))[0].distance;
            }
        }
        let tripCharge = distance * 0.25;
        console.log("Trip between " + initialPos + " and " + finalPos)
        console.log("Distance: " + distance);
        console.log("Total cost: " + tripCharge);
        console.log(); //spacing

        //returning  object with values
        return { "distance": distance, "tripCharge": tripCharge };
    }
}


costOfTrip('QEW', 'Highway 400');
costOfTrip('QEW', 'Appleby Line');
console.log("--------------------------------");


//toll calculator based on rates and distance : version 2
let costOfTrip2 = (weight, initialPos, finalPos) => {
    if (initialPos != finalPos) {
        //finding ids
        const init = findIdOfLocation(initialPos);
        const fin = findIdOfLocation(finalPos);

        //rts carries all rates values for a given weight 
        const rts = rates[weight];

        //getting direction based on longitude (increasing longitude -> westbound)
        let direction = interchanges[init].lng - interchanges[fin].lng > 0 ? 'westbound' : 'eastbound';

        // Calculating distance
        // This piece of code accumulate the routes.distance between initial and final points
        // It is being considered that a distance between 2 points are the same for both directions
        let distance = 0;
        //looping through all objects in the interchanges array
        for (loc in interchanges) {
            //loc is a string in the source: "1", "2"... "24"...
            //necessary double condition for dealing with both ways
            if (parseInt(loc) >= Math.min(init, fin) &&
                parseInt(loc) < Math.max(init, fin)) {
                //getting the distance of the route with a greater id than the current one
                distance += interchanges[loc].routes.filter(
                    r => r.toId > parseInt(loc))[0].distance;
            }
        }

        let kmRate = rts[direction]; //this might get other modifiers later
        let tripCharge = distance * kmRate;
        console.log("Trip between " + initialPos + " and " + finalPos);
        console.log("Direction: " + direction);
        console.log("kmRate: " + kmRate);
        console.log("Distance: " + distance);
        console.log("Total cost: " + tripCharge);
        console.log(); //spacing

        //returning  object with values
        return { "direction": direction, "kmRate": kmRate.toFixed(3), "distance": distance.toFixed(3), tripCharge: tripCharge.toFixed(3) };

    }//IF positions
}//END costOfTrip2

costOfTrip2('light', 'QEW', 'Highway 400');
console.log("--------------------------------");
//Displaying returned object.
console.log(costOfTrip2('heavy', 'Salem Road', 'QEW'));
console.log("--------------------------------");