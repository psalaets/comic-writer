import 'mobx-react-lite/batchingForReactDom';
import { configure } from 'mobx';

configure({
  // observables can only be modified within actions
  enforceActions: 'always'
});
