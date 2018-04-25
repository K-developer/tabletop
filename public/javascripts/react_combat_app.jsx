class Bestiary extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        page : this.props.page,
        encounter: []
      }
    }

    handleClick(i){
        const monsters = this.state.bestiary;
        console.log(monsters[i]);
        if(monsters[i].collapsed){ // Defaults to false so will default to else block
            //if collasped is true it will toggle and un-collapse the box
            monsters[i].classnames = monsters[i].alignment.join("-")+" "+"monsterCard";
            monsters[i].collapsed = false;
        }else{
            //if collasped is false it will toggle and collapse the box
            monsters[i].classnames = monsters[i].alignment.join("-")+" "+"monsterCardCollapsed monsterCard";
            monsters[i].collapsed = true;
        }
        this.setState({bestiary: monsters});
    }


    handleChange(event, i){
        const monsters = this.state.bestiary;
        monsters[i].hit_points = event.target.value;
        this.setState({bestiary: monsters});
    }

    handleAllowDrop(event){
        event.preventDefault();
    }

    handleDrag(i){
        event.preventDefault();
        const monster = this.state.bestiary[i];
        console.log("What a drag...");
        this.setState({"draggingMonster": monster});
    }

    handleDrop(event){
        console.log("here");
        event.preventDefault();
        const monster = this.state.draggingMonster;
        const encounter = this.state.encounter;
        encounter.push(monster);
        console.log("Just a Drop ... in the sea");
        this.setState({"encounter": encounter});
    }

    handleEventTest(event){
        console.log(event);
    }

    changePage(page){
        this.setState({page:page});  
    }

    componentWillReceiveProps(props) {
        this.setState({bestiary: props.bestiary});
    }

    
    

    renderMonsterStatBlock(i){
        const monster = this.state.bestiary[i];
        return(
        <article className={monster.classnames} key={i} draggable="true" onDragStart={this.handleDrag.bind(this, i)}>
            <h1 className="name" key={"name_"+i}>{monster.name}</h1>
            <button className="collapse_button" onClick={this.handleClick.bind(this, i)}>{monster.collapsed ? "Expand" : "Collapse"}</button>
            <h3 key={"cr_"+i}>CR: {monster.challenge_rating}</h3>
            <h3 key={"ac_"+i}>AC: {monster.armor_class}</h3>
            <h3 key={"alignment_"+i}>Alignment: {monster.alignment.join("-")}</h3>
            <h3 key={"size_"+i}>Size: {monster.size}</h3>
            <h3 key={"type_"+i}>Type: {monster.type}</h3>
            <h3 key={"hp_"+i}>HP: <input type="number" min="0" defaultValue={monster.hit_points} onChange={this.handleChange.bind(i)}/></h3>
            <input key={"hp_slider_"+i} type="range" min="0" max={monster.hit_points} defaultValue={monster.hit_points} onChange={this.handleChange.bind(i)} className="hp_slider" />
        </article>
        )
    }

    renderPageNumbers(x){
        return <span className="pageNumber" key={"pg_nm+"+x} onClick={this.changePage.bind(this, x)} href={"?page="+x}>{x+1} ,</span>; 
    }

    renderEncounterBox(){
        return(
                <section className="encounterDropBox" key="drop_encounter" onDrop={this.handleDrop} ondragover={this.handleAllowDrop} ondragenter={this.handleAllowDrop}>
                    
                </section>
            )
    }

    render(){
        let monsters = []
        if(this.props.bestiary.length>1)
        {
            const page = this.state.page;
            const beasts = this.props.bestiary.length >= (page*50) ? (page*50)+50 : this.props.bestiary.length;
            for (var i = (page*50); i< beasts; i++) {
                monsters.push(this.renderMonsterStatBlock(i));
            }
        }

        let pages = [];
        for(let x = 0; x < Math.ceil(this.props.bestiary.length/50); x++){
            pages.push(this.renderPageNumbers(x));
        }
        
      return (
        <section id="playmat" > 
            {monsters}
            {this.renderEncounterBox()}
            <nav className="pages">
                {pages}
            </nav>
        </section>

        
      );
    }
    
    
}

class CombatGenerator extends React.Component {
    constructor() {
      super();
      this.state = {
        bestiary: [{}],
        page : 1
      };
    }

    componentWillMount(){
        window.location.search.replace("?", "").split(/(\?|;)/g).forEach(function(element){
            let currentOption = element.split("=");
            switch(currentOption){
                case "page":
                    this.setState({page: currentOption[1]});
                    break;
                default:
                    break;

            }
            
        })
        $.ajax({
          method: 'POST',
          url: '/game/bestiary',
          success: (res) => {
            let data = res;
            for (var i = data.length - 1; i >= 0; i--) {
                data[i].collapsed = true;
                data[i].classnames = data[i].alignment.join("-")+" "+"monsterCard monsterCardCollapsed";
            }
            this.setState({bestiary:data})
          }
        });
    }

    

  render() {
    return (
      <div className="combatGenerator">
          <Bestiary {...this.state }/>
      </div>
    );
  }
}



ReactDOM.render(
  <CombatGenerator />,
  document.getElementById('targ')
);