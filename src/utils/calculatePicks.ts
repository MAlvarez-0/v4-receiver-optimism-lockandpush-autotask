import { ethers } from 'ethers'

interface ReserverContract {
  getReserveAccumulatedBetween: Function
}

export async function calculatePicks(bitRange: number, cardinality: number, startTime: number, endTime: number, reserveToCalculate: ReserverContract, otherReserve: ReserverContract) {
  const totalPicks = (2 ** bitRange) ** cardinality
  const reserveAccumulated = await reserveToCalculate.getReserveAccumulatedBetween(startTime, endTime)
  // console.log(`${reserveToCalculate.address} reserveAccumulated ${ethers.utils.formatEther(reserveAccumulated)}`)
  const otherReserveAccumulated = await otherReserve.getReserveAccumulatedBetween(startTime, endTime)
  // console.log(`${otherReserve.address} otherReserveAccumulated ${ethers.utils.formatEther(otherReserveAccumulated)}`)
  let numberOfPicks
  if (reserveAccumulated.gt('0')) {
    // console.log(`reserveAccumulated gt 0 ..`)
    numberOfPicks = reserveAccumulated.mul(totalPicks).div(otherReserveAccumulated.add(reserveAccumulated))
  } else {
    // console.log(`calculatePicks setting numberOfPicks: 0`)
    numberOfPicks = ethers.BigNumber.from('0')
  }
  // console.log(`returning numberOfPicks ${Math.floor(numberOfPicks)}`)
  return Math.floor(numberOfPicks)
}

export default calculatePicks;