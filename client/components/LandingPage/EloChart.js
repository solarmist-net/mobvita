import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useSelector } from 'react-redux'
import moment from 'moment-timezone'
import { useIntl } from 'react-intl'

const EloChart = ({ width }) => {
  const rawEloHistory = useSelector(({ user }) => user.data.user.exercise_history)
  const eloHistory = rawEloHistory.map(exercise => exercise.score)
  const weeklyPracticeTimeHistory = useSelector(({ user }) => user.data.user.weekly_times)
  const intl = useIntl()

  if (eloHistory.length === 0) return null

  const filteredHistory = []
  const weeks = weeklyPracticeTimeHistory.map(element => element.week).reverse()

  rawEloHistory.forEach((e) => {
    const date = new Date(e.date)
    const week = moment(new Date(date)).week()
    const weekday = moment(new Date(date)).isoWeekday()

    if (weeks.find(element => element === week)) {
      filteredHistory.push({ weekday, score: e.score, week })
    }
  })

  const eloResults = []
  let previousScore
  let score = null
  weeks.forEach((weekNumber) => {
    for (let day = 1; day <= 7; day++) {
      const element = filteredHistory.find(element => element.week === weekNumber && element.weekday === day)
      if (element) {
        score = element.score
        eloResults.push(score)
      } else {
        previousScore = score
        eloResults.push(null)
      }
    }
  })


  for (let i = 0; i < eloResults.length; i++) { // Replace beginning nulls
    if (eloResults[i]) {
      for (let j = i; j >= 0; j--) {
        eloResults[j] = eloResults[i]
      }
      break
    }
  }

  for (let i = 0; i < eloResults.length; i++) { // Fill blank days
    if (!eloResults[i]) {
      eloResults[i] = eloResults[i - 1]
    }
  }

  const practicetimes = {
    type: 'column',
    yAxis: 1,
    xAxis: 1,
    data: weeklyPracticeTimeHistory.map(element => element.practice_time).reverse(),
  }

  const maxElo = Math.max(...eloHistory)
  const minElo = Math.min(...eloHistory)

  console.log(maxElo + (maxElo * 0.01))

  const options = {
    title: { text: '' },
    series: [practicetimes, { data: eloResults }],
    chart: { height: '35%' },
    legend: { enabled: false },
    credits: { enabled: false },
    tooltip: {
      formatter() {
        // eslint-disable-next-line react/no-this-in-sfc
        return this.y
      },
    },
    yAxis: [{
      title: { enabled: false },
      max: maxElo + (maxElo * 0.005),
      min: minElo - (minElo * 0.005),
      endOnTick: false,
      startOnTick: false,
      tickPositions: [Math.ceil(maxElo / 5) * 5, Math.floor(minElo / 5) * 5],
    },
    {
      title: { enabled: false },
      visible: false,
    }],
    xAxis: [
      { visible: false },
      { visible: false },
    ],
    plotOptions: {
      series: {
        groupPadding: 0,
        pointPadding: 0,
        borderWidth: 0,
      },
      line: { marker: { enabled: false } },
    },
  }
  return (
    <div style={{ textAlign: 'center', width }}>
      <span style={{ display: 'inline-block', paddingBottom: '1em' }}>{`${intl.formatMessage({ id: 'score' })}: ${eloHistory[eloHistory.length - 1]}`}</span>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        allowChartUpdate={false}
      />
    </div>
  )
}

export default EloChart
