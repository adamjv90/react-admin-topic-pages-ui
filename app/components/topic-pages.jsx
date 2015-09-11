import React from 'react';
import update from 'react/lib/update';
import {indexOf, findWhere, partial, pluck, reduce, isUndefined, unique, flatten} from 'lodash';
import request from 'superagent';
import EditSlides from 'components/partials/edit-slides';
import EditFacetes from 'components/partials/edit-facetes';
import TopicsMenu from 'components/partials/topics-menu';

if (process.env.BROWSER) {
  require('styles/topic-pages.scss');
}

export default React.createClass({
  displayName: 'TopicPages',

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      topics: [{
        topic: 'Flowers',
        slides: [{
          title: 'Test',
          url: 'http://google.com',
          description: 'Blah blah',
          image: ''
        }],
        facetes: [{
          position: 0,
          term: 'Flowers',
          terms: ['Penonies', 'Sun Flower', 'Daises']
        }, {
          position: 1,
          term: 'Season',
          terms: ['Summer', 'Winter']
        }]
      },
      {
        topic: 'Decor',
        slides: [{
          title: 'Test',
          url: 'http://google.com',
          description: 'Blah blah',
          image: ''
        }, {
          title: 'Test',
          url: 'http://google.com',
          description: 'Blah blah',
          image: 'http://o.aolcdn.com/smp/is/submissions/uploads/35493/537e54170ff72$!x900.jpg'
        }],
        facetes: [{
          term: 'Flowers',
          terms: ['Daisies', 'Penonies', 'Sun Flower']
        }]
      }],
      editing: {
        topic: '',
        action: ''
      },
      terms: []
    };
  },

  componentDidMount() {
    request
      .get('http://www.stylemepretty.com/api/vault/tags')
      .end((err, res) => {
        if (!err) {
          this.setState(Object.assign(this.state, {terms: res.body.tags}));
        }
      });
  },

  setEditing(topic, action) {
    this.setState(Object.assign(this.state, {
      editing: {action, topic}
    }));
  },

  createTopic(topic) {
    this.setState(update(this.state, {
      topics: {
        $unshift: [{
          topic: topic,
          slides: [],
          facetes: []
        }]
      },
      editing: {
        $set: {
          topic: topic,
          action: 'edit-slides'
        }
      }
    }));
  },

  removeTopic(topic) {
    let editing = this.state.editing;

    if (editing.topic === topic) {
      editing = {
        topic: '',
        action: ''
      };
    }

    this.setState(update(this.state, {
      topics: {
        $splice: [[indexOf(this.state.topics, findWhere(this.state.topics, {topic: topic})), 1]]
      },
      editing: {
        $set: editing
      }
    }));
  },

  updateSlides(topic, slides) {
    const topicIndex = indexOf(this.state.topics, findWhere(this.state.topics, {topic: topic}));

    this.setState(update(this.state, {
      topics: {
        $splice: [[topicIndex, 1, update(this.state.topics[topicIndex], {
          slides: {
            $set: slides
          }
        })]]
      }
    }));
  },

  updateFacetes(topic, facetes) {
    const topicIndex = indexOf(this.state.topics, findWhere(this.state.topics, {topic: topic}));

    this.setState(update(this.state, {
      topics: {
        $splice: [[topicIndex, 1, update(this.state.topics[topicIndex], {
          facetes: {
            $set: facetes
          }
        })]]
      }
    }));
  },

  renderEdit() {
    if (this.state.editing.action === 'edit-slides') {
      return <EditSlides slides={findWhere(this.state.topics, {topic: this.state.editing.topic}).slides} onSave={partial(this.updateSlides, this.state.editing.topic)} onCancel={partial(this.setEditing, '', '')} />;
    }
    else if (this.state.editing.action === 'edit-facetes') {
      const combined = reduce(flatten(pluck(this.state.topics, 'facetes')), (facetes, facete) => {
        if (isUndefined(facetes[facete.term])) {
          facetes[facete.term] = [];
        }
        facetes[facete.term] = unique(facetes[facete.term].concat(facete.terms)).sort();
        return facetes;
      }, {});
      return <EditFacetes recommended={combined} suggestions={this.state.terms} facetes={findWhere(this.state.topics, {topic: this.state.editing.topic}).facetes} onSave={partial(this.updateFacetes, this.state.editing.topic)} onCancel={partial(this.setEditing, '', '')} />;
    }

    return <div />;
  },

  render() {
    return (
      <div className="topic-pages-admin">
        <div className="topic-menu">
          <TopicsMenu {...this.state} showCreate={!this.state.editing.topic} onAction={this.setEditing} onRemove={this.removeTopic} onCreate={this.createTopic} />
        </div>
        <div className="edit-screen">
          {this.renderEdit()}
        </div>
      </div>
    );
  }
});
