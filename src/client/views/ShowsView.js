import React       from 'react';
import { connect } from 'react-redux';
import { fetchShowsIfNeeded } from 'actions/shows';
import Show from 'components/show';

// We define mapStateToProps where we'd normally use the @connect
// decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  counter : state.counter,
  shows: state.shows
});

export class ShowsView extends React.Component {
  static propTypes = {
    dispatch : React.PropTypes.func,
    counter  : React.PropTypes.number,
    shows: React.PropTypes.object
  }

  constructor (props) {
    super(props);
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchShowsIfNeeded());
  }

  // normally you'd import an action creator, but I don't want to create
  // a file that you're just going to delete anyways!
  _increment () {
    this.props.dispatch({ type : 'COUNTER_INCREMENT', test: 2 });
  }

  render () {
    const { items, isFetching, lastUpdated } = this.props.shows;

    let shows;

    if (items) {
      shows = items.map((show, index) => {
        return <Show {...show} key={index} />;
      });
    }

    return (
      <div className='container'>
        <h1>Shows</h1>
        <table className='u-full-width'>
          <thead>
            <tr>
              <th>Show</th>
              <th>Network</th>
              <th>Quality</th>
              <th>Downloads</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {shows}
          </tbody>
        </table>


      </div>
    );
  }
}

export default connect(mapStateToProps)(ShowsView);
