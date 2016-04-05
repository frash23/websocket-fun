'use strict';

exports.arrayContains = (arr, val)=> arr.indexOf(val) > -1;

exports.randomUint32 = ()=> Math.floor( Math.random() * ( Math.pow(2, 31) - 1 ) );

exports.constructTPCheader = function(packetId, flags) {
	var flagMap = 0b000;

	/* Set the first bit, informing the receiever that the data is compressed with lz-string */
	if(flags && flags.compress) flagMap |= 0b1000;
	
	/* The ID takes up the first 12 bits, the last 4 are for flags */
	packetId &= 0xFFF;
	/* Shift left to make space for the flags */
	packetId <<= 0x04;

	packetId += flagMap;

	return packetId;
}
