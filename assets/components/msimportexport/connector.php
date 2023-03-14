<?php
/**
 * msImportExport Connector
 * @package msimportexport
 */

require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
require_once MODX_CONNECTORS_PATH.'index.php';

$corePath = $modx->getOption('msimportexport.core_path',null,$modx->getOption('core_path').'components/msimportexport/');
require_once $corePath.'model/msimportexport/msie.class.php';
$modx->msie = new Msie($modx);

$modx->lexicon->load('msimportexport:default');

/* handle request */
$path = $modx->getOption('processorsPath',$modx->msie->config,$corePath.'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
