import React, { useEffect, useState } from 'react'

import ReactPlaceholder from 'react-placeholder'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'

import styles from '../styles/Bus.module.css'

import AppNavbar from '../components/AppNavbar'
import { getBusPlan } from '../lib/reimplemented-api-client'
import { useTime } from '../lib/time-hook'
import { formatFriendlyRelativeTime } from '../lib/date-utils'
import { stations, defaultStation } from '../data/bus.json'

export default function Bus () {
  const time = useTime()
  const [station, setStation] = useState(null)
  const [departures, setDepartures] = useState(null)

  useEffect(() => {
    setStation(localStorage.station || defaultStation)
  }, [])

  useEffect(async () => {
    setDepartures(null)

    if (!station) {
      return
    }

    try {
      setDepartures(await getBusPlan(station))
      localStorage.station = station
    } catch (e) {
      console.error(e)
      alert(e)
    }
  }, [time, station])

  return (
    <Container>
      <AppNavbar title="Bus" />

      <Form.Group controlId="stationSelect">
        <Form.Control
          as="select"
          className={styles.stationSelect}
          value={station || ''}
          onChange={e => setStation(e.target.value)}
        >
          {stations.map(station =>
            <option key={station.id} value={station.id}>{station.name}</option>
          )}
        </Form.Control>
      </Form.Group>

      <ListGroup variant="flush">
        <ReactPlaceholder type="text" rows={10} color="#eeeeee" ready={departures}>
          {departures && departures.map((item, idx) =>
            <ListGroup.Item key={idx} className={styles.item}>
              <div className={styles.route}>
                {item.route}
              </div>
              <div className={styles.destination}>
                {item.destination}
              </div>
              <div className={styles.time}>
                {formatFriendlyRelativeTime(new Date(item.time), time)}
              </div>
            </ListGroup.Item>
          )}
        </ReactPlaceholder>
      </ListGroup>

      <br />
    </Container>
  )
}
