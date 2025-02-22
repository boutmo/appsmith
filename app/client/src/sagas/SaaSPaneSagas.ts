import { all, select, takeEvery } from "redux-saga/effects";
import { ReduxAction, ReduxActionTypes } from "constants/ReduxActionConstants";
import history from "utils/history";
import { getPlugin } from "selectors/entitiesSelector";
import { Datasource } from "entities/Datasource";
import { Action, PluginType } from "entities/Action";
import { Plugin } from "api/PluginApi";
import { saasEditorApiIdURL, saasEditorDatasourceIdURL } from "RouteBuilder";

function* handleDatasourceCreatedSaga(actionPayload: ReduxAction<Datasource>) {
  const plugin = yield select(getPlugin, actionPayload.payload.pluginId);
  // Only look at SAAS plugins
  if (plugin.type !== PluginType.SAAS) return;

  history.push(
    saasEditorDatasourceIdURL({
      pluginPackageName: plugin.packageName,
      datasourceId: actionPayload.payload.id,
      params: { from: "datasources" },
    }),
  );
}

function* handleActionCreatedSaga(actionPayload: ReduxAction<Action>) {
  const { id, pluginId } = actionPayload.payload;
  const plugin: Plugin = yield select(getPlugin, pluginId);

  if (plugin.type !== "SAAS") return;
  history.push(
    saasEditorApiIdURL({
      pluginPackageName: plugin.packageName,
      apiId: id,
      params: {
        editName: "true",
        from: "datasources",
      },
    }),
  );
}

// since we are re-using the query editor form names for SAAS actions, all formValueChanges will be handled in the QuerypaneSagas.

export default function* root() {
  yield all([
    takeEvery(
      ReduxActionTypes.CREATE_DATASOURCE_SUCCESS,
      handleDatasourceCreatedSaga,
    ),
    takeEvery(ReduxActionTypes.CREATE_ACTION_SUCCESS, handleActionCreatedSaga),
  ]);
}
