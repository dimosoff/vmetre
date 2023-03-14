<?php
define('MODX_API_MODE', true);
require_once dirname(dirname(dirname(dirname(__FILE__)))) . '/index.php';

$modx->getService('error', 'error.modError');
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');

if (isset($_SERVER['argv']) && !empty($_SERVER['argv'])) {
    if ($argv = array_slice($_SERVER['argv'], 1)) {
        foreach ($argv as $val) {
            if ($param = explode('=', $val, 2)) {
                $_GET[$param[0]] = $param[1];
            }

        }
    }
}

$ctx = isset($_GET['ctx']) ? $_GET['ctx'] : $modx->getOption('msimportexport.export.ctx', null, 'web', true);

/** @var Msie $msie */
$msie = $modx->getService('msimportexport', 'Msie', $modx->getOption('msimportexport.core_path', null, $modx->getOption('core_path') . 'components/msimportexport/') . 'model/msimportexport/', array());
$msie->initialize($ctx);

if (!$msie->checkValidityСatalog()) {
    header('Content-Type: text/html; charset=utf-8');
    echo $modx->lexicon('msimportexport.err_invalid_catalog');
    return;
}

if (isset($_GET['to']) && isset($_GET['token']) && isset($_GET['preset'])) {
    if ($msie->checkExportToken($_GET['token'])) {
        $save = isset($_GET['save']) ? filter_var($_GET['save'], FILTER_VALIDATE_BOOLEAN) : 0;
        $type = isset($_GET['type']) ? $_GET['type'] : 'products';
        $path = isset($_GET['path']) ? $_GET['path'] : '';
        $filename = isset($_GET['filename']) ? $_GET['filename'] : '';
        $categories = isset($_GET['categories']) ? $_GET['categories'] : '';
        $preset = isset($_GET['preset']) ? $_GET['preset'] : 0;
        switch ($_GET['to']) {
            case 'csv':
            case 'xlsx':
                echo $msie->export($_GET['to'], $preset, $save, $type, $path, $filename, $categories);
                break;
            case 'xml':
                echo $msie->exportToYmarket($save, $preset, $path, $filename, $categories);
                break;
            default:
                echo 'Export format is not supported';
        }
    } else {
        echo 'Error incorrect token';
    }
} else {
    echo 'Error incorrect option';
}
@session_write_close();