<?php
ini_set('display_errors', 1);
ini_set('error_reporting', -1);

if (file_exists(dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php')) {
    /** @noinspection PhpIncludeInspection */
    require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/config.core.php';
}
else {
    require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
}
/** @noinspection PhpIncludeInspection */
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
/** @noinspection PhpIncludeInspection */
require_once MODX_CONNECTORS_PATH . 'index.php';
/** @var seoTemplates $seoTemplates */
$seoTemplates = $modx->getService('seotemplates', 'seoTemplates', $modx->getOption('seotemplates_core_path', null,
        $modx->getOption('core_path') . 'components/seotemplates/') . 'model/seotemplates/'
);
$modx->lexicon->load('seotemplates:default');

// handle request
$corePath = $modx->getOption('seotemplates_core_path', null, $modx->getOption('core_path') . 'components/seotemplates/');
$path = $modx->getOption('processorsPath', $seoTemplates->config, $corePath . 'processors/');
$modx->getRequest();

/** @var modConnectorRequest $request */
$request = $modx->request;
$request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));