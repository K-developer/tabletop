class Bestiary extends React.Component {
    constructor() {
      super();
      this.state = {
        bestiary: [{}],
        page : 0
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

    }

    componentDidMount(){
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

    handleClick(i){
        const monsters = this.state.bestiary;
        console.log(monsters[i].collapsed);
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

    handleChange(){
    }

    changePage(page){
        this.setState({page:page});
    }
    

    renderMonsterStatBlock(i){
        const monster = this.state.bestiary[i];
        return(
        <article className={monster.classnames} key={i}>
            <h1 className="name" key={"name_"+i}>{monster.name}</h1>
            <button className="collapse_button" onClick={this.handleClick.bind(this, i)}>{monster.collapsed ? "Expand" : "Collapse"}</button>
            <h3 key={"cr_"+i}>CR: {monster.cr}</h3>
            <h3 key={"ac_"+i}>AC: {monster.ac}</h3>
            <h3 key={"init_"+i}>Initiative: {monster.init}</h3>
            <h3 key={"alignment_"+i}>Alignment: {monster.alignment.join("-")}</h3>
            <h3 key={"size_"+i}>Size: {monster.size}</h3>
            <h3 key={"type_"+i}>Type: {monster.type}</h3>
            <h3 key={"hp_"+i}>HP: <input type="number" min="0" defaultValue={monster.hp} onChange={this.handleChange}/></h3>
            <input key={"hp_slider_"+i} type="range" min="0" max={monster.hp} defaultValue={monster.hp} onChange={this.handleChange} className="hp_slider" />
        </article>
        )
    }

    renderPageNumbers(x){
        return <span className="pageNumber" key={"pg_nm+"+x} onClick={this.changePage.bind(this, x)} href={"?page="+x}>{x+1} ,</span>; 
    }

    render(){
        let monsters = []
        if(this.state.bestiary.length>1)
        {
            const page = this.state.page;
            const beasts = this.state.bestiary.length >= (page*50) ? (page*50)+50 : this.state.bestiary.length;
            for (var i = (page*50); i< beasts; i++) {
                monsters.push(this.renderMonsterStatBlock(i));
            }
        }

        let pages = [];
        for(let x = 0; x < Math.ceil(this.state.bestiary.length/50); x++){
            pages.push(this.renderPageNumbers(x));
        }
        
      return (
        <section id="playmat"> 
            {monsters}
            <nav className="pages">
                {pages}
            </nav>
        </section>

        
      );
    }
    
    
}

class CombatGenerator extends React.Component {
  render() {
    return (
      <div className="combatGenerator">
          <Bestiary />
      </div>
    );
  }
}


ReactDOM.render(
  <CombatGenerator />,
  document.getElementById('targ')
);