# TODO: better document
# example take from: https://github.com/jsdf/coffee-react
NeatComponent = React.createClass
  render: ->
    <div className="neat-component">
      {<h1>A Component is I</h1> if @props.showTitle}
      <hr />
      {<p key={n}>This line has been printed {n} times</p> for n in [1..5]}
    </div>
