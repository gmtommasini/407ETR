/* v1.1
changed costOfTrip2: 
-added distance difference in both directions
-changed: direction based on interchanges numbers instead of longitude
-if initial and final points are the same, the function will now return default empty
*/

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

/*
//testing
costOfTrip('QEW', 'Highway 400');
costOfTrip('QEW', 'Appleby Line');
console.log("--------------------------------");
*/

//toll calculator based on rates and distance : version 2
let costOfTrip2 = (weight, initialPos, finalPos) => {
    //initiating variables to default
    let direction = "";
    let kmRate = 0;
    let tripCharge = 0;
    let distance = 0;

    //only calculate if points are different
    if (initialPos != finalPos) {
        //finding ids
        const init = findIdOfLocation(initialPos);
        const fin = findIdOfLocation(finalPos);

        //rts carries all rates values for a given weight 
        const rts = rates[weight];

        //getting direction based on longitude (decreasing longitude -> westbound) (does not work well because 1 and 2)
        //direction = interchanges[init].lng - interchanges[fin].lng > 0 ? 'westbound' : 'eastbound';

        //getting direction based on "1" being the eastermost 
        direction = interchanges[init] - interchanges[fin] < 0 ? 'westbound' : 'eastbound'; // 1 is the most east

        // Calculating distance
        // This piece of code accumulate the routes.distance between initial and final points
        // looping through all objects in the interchanges array
        for (loc in interchanges) {

            //distace in both directions might be different
            if (direction == "eastbound") //from a small to a greater point
            {
                //loc is a string in the source: "1", "2"... "24"... so we need to parseInt()
                //necessary double condition for dealing with both ways
                if (parseInt(loc) >= Math.min(init, fin) &&
                    parseInt(loc) < Math.max(init, fin)) {
                    //getting the distance of the route with a greater id than the current one
                    distance += interchanges[loc].routes.filter(
                        r => r.toId > parseInt(loc))[0].distance; //distance to greater id
                }
            } else //from great to a smaller point
            {
                if (parseInt(loc) > Math.min(init, fin) &&
                    parseInt(loc) <= Math.max(init, fin)) {
                    //getting the distance of the route with a greater id than the current one
                    distance += interchanges[loc].routes.filter(
                        r => r.toId < parseInt(loc))[0].distance; //distance till lesser id
                }
            }
        }

        kmRate = rts[direction]; //this might get other modifiers later
        tripCharge = distance * kmRate;
    }//IF positions
    //else NO distance -> default values

    console.log("Trip between " + initialPos + " and " + finalPos);
    console.log("Direction: " + direction);
    console.log("kmRate: " + kmRate);
    console.log("Distance: " + distance);
    console.log("Total cost: " + tripCharge);
    console.log(); //spacing

    //returning  object with values (3 decimal digits)
    return { "direction": direction, "kmRate": kmRate.toFixed(3), "distance": distance.toFixed(3), tripCharge: tripCharge.toFixed(3) };

}//END costOfTrip2


//Testing *******************
costOfTrip2('light', 'QEW', 'Highway 400');
console.log("--------------------------------");
//Displaying returned object.
console.log(costOfTrip2('heavy', 'Salem Road', 'QEW'));
console.log(costOfTrip2('heavy', 'Bayview Avenue', 'Bayview Avenue'));
console.log("--------------------------------");