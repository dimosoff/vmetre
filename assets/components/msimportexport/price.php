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

$ctx = isset($_POST['ctx']) ? $_POST['ctx'] : $modx->getOption('msimportexport.export.ctx', null, 'web', true);
$modx->lexicon->load('msimportexport:price');

/** @var Msie $msie */
$msie = $modx->getService('msimportexport', 'Msie', $modx->getOption('msimportexport.core_path', null, $modx->getOption('core_path') . 'components/msimportexport/') . 'model/msimportexport/', array());
$msie->initialize($ctx);

if (isset($_GET['clear'])) {
    if ($msie->checkExportToken($_GET['clear'])) {
        $msie->clearAccessDownloadPrice();
        echo 'Clear completed';
    } else {
        echo 'Error incorrect token';
    }
    exit();
}

$out = '';
$error = '';

$options = @$_SESSION['MsieBtnDownloadPrice'][$_REQUEST['key']];

if (empty($options) || !is_array($options)) {
    $options = array();
}

if (isset($options['sig']) && !empty($options['sig'])) {
    $sig = $options['sig'];
    unset($options['sig']);
    if ($sig == $msie->generateSig($options)) {
        if ($msie->checkAccessDownloadPrice($sig)) {
            $to = isset($options['to']) ? $options['to'] : 'xlsx';
            $res = isset($options['res']) ? $options['res'] : 0;
            $filename = isset($options['filename']) ? $options['filename'] : '';
            if (isset($options['preset']) && !empty($options['preset'])) {
                $preset = $options['preset'];
            } else {
                $preset = 0;
                $options['fields'] = 'pagetitle,price,href';
            }
            $msie->regAccessDownloadPrice($sig);
            if (!empty($options['element'])) {
                $elementName = $options['element'];
                $elementSet = array();
                if (strpos($elementName, '@') !== false) {
                    list($elementName, $elementSet) = explode('@', $elementName);
                }
                /** @var modSnippet $snippet */
                if (!empty($elementName) && $element = $modx->getObject('modSnippet', array('name' => $elementName))) {
                    $elementProperties = $element->getProperties();
                    $elementPropertySet = !empty($elementSet)
                        ? $element->getPropertySet($elementSet)
                        : array();
                    if (!is_array($elementPropertySet)) {
                        $elementPropertySet = array();
                    }
                    $params = array_merge(
                        $elementProperties,
                        $elementPropertySet,
                        $options,
                        array(
                            'returnIds' => 1,
                        )
                    );
                    $options['resources'] = $element->process($params);
                } else {
                    $modx->log(modX::LOG_LEVEL_ERROR, 'Could not find main snippet with name: "' . $elementName . '"');
                }
            }
            $out = $msie->export($to, $preset, 0, 'products', '', $filename, $res, $options);
        } else {
            $timeout = (int)$modx->getOption('msimportexport.price.timeout', null, 180);
            $error = sprintf($modx->lexicon('msie.err.timeout'), $timeout);
        }
    } else {
        $error = $modx->lexicon('msie.err.sig');
    }
} else {
    $error = $modx->lexicon('msie.err.sig');
}

header('msie-error:' . $error);

echo $out;

@session_write_close();