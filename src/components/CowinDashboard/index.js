// Write your code here
import Loader from 'react-loader-spinner'
import './index.css'
import {Component} from 'react'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

const apiStatus = {
  initial: 'INITIAL',
  onProgress: 'PROGRESS',
  onSuccess: 'SUCCESS',
  onFailure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {fetchedData: {}, apiStatusId: apiStatus.initial}

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.setState({apiStatusId: apiStatus.onProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        apiStatusId: apiStatus.onSuccess,
        fetchedData: updatedData,
      })
    } else {
      this.setState({apiStatusId: apiStatus.onFailure})
    }
  }

  getSuccessData = () => {
    const {fetchedData} = this.state
    const {last7DaysVaccination, vaccinationByAge, vaccinationByGender} =
      fetchedData
    return (
      <>
        <VaccinationCoverage
          VaccinationCoverageDetails={last7DaysVaccination}
        />
        <VaccinationByGender VaccinationByGenderDetails={vaccinationByGender} />
        <VaccinationByAge VaccinationByAgeDetails={vaccinationByAge} />
      </>
    )
  }

  getFailureData = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
        className="image"
      />
      <h1 className="failure-head">Something Went Wrong</h1>
    </div>
  )

  getProgressData = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  getUpdatedStatus = () => {
    const {apiStatusId} = this.state
    switch (apiStatusId) {
      case apiStatus.onSuccess:
        return this.getSuccessData()

      case apiStatus.onFailure:
        return this.getFailureData()

      case apiStatus.onProgress:
        return this.getProgressData()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg">
        <div className="head-bg">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="img"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <h1 className="para">CoWin Vaccination In India</h1>
        <div className="con">{this.getUpdatedStatus()}</div>
      </div>
    )
  }
}

export default CowinDashboard
