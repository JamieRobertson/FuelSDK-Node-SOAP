/**
 * What is SendID? - SendID is the same as JobID (as shown in ET UI)
 * 
 * This script requires a SendID and of course your clientID and clientSecret
 * Set your clientID and clientSecret in the 'example-credentials.js' file  
 * then rename the file to just 'credentials.js'
 * 
 * In the docs:
 * https://help.exacttarget.com/en/technical_library/web_service_guide/technical_articles/retrieving_all_lists_for_a_send/
 * 
 */

'use strict';

var FuelSoap = require('../../lib/fuel-soap'), 
	 	auth = require('./credentials');

// Fetch API token
var SoapClient = new FuelSoap(auth);

var r;

function percentageOf(part, whole) {
	var n = 0;
	n = ( (part / whole) * 100 );
	return String(parseFloat( n.toFixed(2) ));
}	

function calculateValues(err, response) {
	if (err) { throw err; }
		
	if (response.body.OverallStatus === 'OK') {
		r = response.body.Results[0];
		// Deliverabilty Rate
		r.DeliverabilityRate = percentageOf(r.NumberDelivered, r.NumberSent);
		// OpenRate
		r.OpenRate = percentageOf(r.UniqueOpens, r.NumberDelivered);
		// ClickThroughRate
		r.ClickThroughRate = percentageOf(r.UniqueClicks, r.NumberDelivered);
		// UnsubscribeRate
		r.UnsubscribeRate = percentageOf(r.Unsubscribes, r.NumberDelivered);
		console.log(r);
	}
}

function getEventData(sendID) {
	var props = [
		'Client.ID', 'SendID', 'List.ID', 'List.ListName', 'Duplicates', 'InvalidAddresses', 'ExistingUndeliverables', 'ExistingUnsubscribes', 'HardBounces', 'SoftBounces', 'OtherBounces', 'ForwardedEmails', 'UniqueClicks', 'UniqueOpens', 'NumberSent', 'NumberDelivered', 'Unsubscribes', 'MissingAddresses'
	];
	var options = {
		filter: {
			leftOperand: 'SendID',
			operator: 'equals',
			rightOperand: sendID
		} 
	};

	SoapClient.retrieve('ListSend', props, options, calculateValues );
}

getEventData('787796');



// The email queried:
/*
20151120 - Navi Retlav - AB test subject lines
Do you want more free beats and loops?
Reason Weekly
151120 - Reason8
2015-11-20 18:04
19,932
5,454
820
4.1%
27.4%
99.8%
22
0.1%
*/ 

// The JSON returned:
/*
[ 
	{ 
		Client: { 
			ID: '6246661' 
		},
	    PartnerKey: '',
	    ObjectID: '',
	    SendID: '787796',
	    List: { 
	    	PartnerKey: '',
			ID: '70',
			ObjectID: '',
			ListName: 'All Subscribers' 
		},
	    Duplicates: '0',
	    InvalidAddresses: '0',
	    ExistingUndeliverables: '0',
	    ExistingUnsubscribes: '0',
	    HardBounces: '13',
	    SoftBounces: '3',
	    OtherBounces: '15',
	    ForwardedEmails: '0',
	    UniqueClicks: '821',
	    UniqueOpens: '5460',
	    NumberSent: '19932',
	    NumberDelivered: '19901',
	    Unsubscribes: '22',
	    MissingAddresses: '0' 
	} 
]
*/

