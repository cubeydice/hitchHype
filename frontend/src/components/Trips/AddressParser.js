
// This code was taken from parse address string fluffybunnies,
// https://www.npmjs.com/package/parse-address-string?activeTab=readme
function explodeAddress(singleLineAddress,cb){
    var addressObj = {
        street_address1: null
        ,city: null
        ,state: null
        ,postal_code: null
        ,country: null
    }
    if (typeof singleLineAddress != 'string') {
        //return cb(new Error('Input must be a String'))
        return cb(false,addressObj)
    }
    singleLineAddress = singleLineAddress.trim()

    var postalCode = singleLineAddress.match(/([0-9]{5})|([a-z][0-9][a-z] ?[0-9][a-z][0-9])/gi)
        ,indexOfPostalCode = -1
    if (postalCode) {
        postalCode = postalCode.pop() // pick match closest to end
        indexOfPostalCode = singleLineAddress.lastIndexOf(postalCode)
        if (indexOfPostalCode == 0 && singleLineAddress.length > 10) {
            // postal code is probably part of street address
            postalCode = null
            indexOfPostalCode = -1
        }
        if (postalCode) {
            addressObj.postal_code = postalCode
            var everythingAfterPostalCode = singleLineAddress.substr(indexOfPostalCode+postalCode.length)
            singleLineAddress = singleLineAddress.substr(0,indexOfPostalCode)+everythingAfterPostalCode
            var possibleCountry = everythingAfterPostalCode.replace(/\s*,/,'').split(',').shift().trim()
            if (possibleCountry && looksLikeCountry(possibleCountry)) {
                addressObj.country = possibleCountry
                singleLineAddress = singleLineAddress.substr(0,indexOfPostalCode) // just ditch everything after postal + country
            }
        }
    }

    var addySplit = singleLineAddress.split(',')

    // Handle special cases...
    // Neighborhood, City, State
    if (addySplit.length == 3 && looksLikeState(addySplit[2])) {
        addressObj.street_address1 = addySplit[0].trim()
        addressObj.city = addySplit[1].trim()
        addressObj.state = addySplit[2].trim()
        return cb(false,addressObj)
    }

    // Handle generic case...
    addySplit.forEach(function(addyPart){
        if (!(addyPart = addyPart.trim())) return
        // if has numbers, assume street address
        if (/[0-9]/.test(addyPart)) {
            return !addressObj.street_address1 && (addressObj.street_address1 = addyPart)
        }
        // if looks like state
        if (looksLikeState(addyPart) && !addressObj.state) {
            return addressObj.state = addyPart
        }
        // if looks like country
        if (looksLikeCountry(addyPart)) {
            return !addressObj.country && (addressObj.country = addyPart)
        }
        // else assume city
        !addressObj.city && (addressObj.city = addyPart)
    })

    cb(false,addressObj)
}


let countries
function looksLikeCountry(str){
if (!countries) {
    var map = require('./countries.json')
    countries = {}
    for (var k in map) {
        if (map.hasOwnProperty(k)){
            countries[k.toLowerCase()] = true
            countries[map[k].toLowerCase()] = true
        }
    }
}
str = str.trim().toLowerCase()
if (str == 'usa') {
    return true
}
return !!countries[str]
}

let states
function looksLikeState(str){
if (!states) {
    var map = require('./states.json')
    states = {}
    for (var k in map) {
        if (map.hasOwnProperty(k)){
            states[k.toLowerCase()] = true
            states[map[k].toLowerCase()] = true
        }
    }
}
str = str.trim().toLowerCase()
return !!states[str]
}

export default explodeAddress