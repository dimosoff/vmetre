<?php
header('Content-Type: application/json; charset=UTF-8');
define('MODX_API_MODE', true);
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/index.php';

$modx->getService('error','error.modError');
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');


$ctx = isset($_REQUEST['ctx']) ? $_REQUEST['ctx'] : 'web';

/** @var Msie $msie */
$msie = $modx->getService('msimportexport', 'Msie', $modx->getOption('msimportexport.core_path', null, $modx->getOption('core_path') . 'components/msimportexport/') . 'model/msimportexport/', array());
$msie->initialize($ctx);


if ($_SERVER['HTTP_X_REQUESTED_WITH'] != 'XMLHttpRequest') {
    $modx->sendRedirect($modx->makeUrl($modx->getOption('site_start'),'','','full'));
}
elseif (!empty($_REQUEST['controller'])) {
        $out = array('result'=>false);
        $dataType = isset($_REQUEST['data_type']) ? $_REQUEST['data_type'] : 'json';
        if($controller = $rvg->loadController(ucfirst($_REQUEST['controller']))){
            unset($_REQUEST['controller']);
            $out =  $controller->run($_REQUEST);
        } else {
            $out['error'] = array('controller'=>'invalid load controller');
        }
        echo $dataType == 'json'  ? $modx->toJSON($out) : $out;
}
@session_write_close();