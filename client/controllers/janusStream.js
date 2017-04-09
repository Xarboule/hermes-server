/**
 * Created by xarboule on 11/03/17.
 */

Janus.init({
    debug: true,
    callback: function() {

        var janus = new Janus(
            {
                server: 'ws://157.159.47.49:8188/',
                success: function() {
                    // Done! attach to plugin XYZ
                    console.log("CONNECTÉ AU SERVEUR JANUS");
                    janus.attach({

                        plugin: "janus.plugin.streaming",
                        success: function(pluginHandle){
                            streaming = pluginHandle;
                            Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
                            var body = { "request": "list" };
                            streaming.send({"message": body, success: function(result) {

                                if(result["list"] !== undefined && result["list"] !== null) {
                                    // Mettre le streamid
                                    var list = result["list"];
                                    Janus.debug("Liste des stream : "+list);
                                    var body = { "request": "watch", id: 1};
                                    streaming.send({"message": body});
                                }
                                else
                                {
                                    console.log("CRITIQUE : Pas de stream disponible !");
                                }


                            }});



                        },

                        onmessage: function(msg, jsep) {
                            // Handle msg, if needed, and check jsep
                            if(jsep !== undefined && jsep !== null) {
                                // We have an OFFER from the plugin
                                streaming.createAnswer(
                                    {
                                        // We attach the remote OFFER
                                        jsep: jsep,
                                        // We want recvonly audio/video
                                        media: { audioSend: false, videoSend: false },
                                        success: function(ourjsep) {
                                            // Got our SDP! Send our ANSWER to the plugin
                                            var body = { "request": "start" };
                                            streaming.send({"message": body, "jsep": ourjsep});
                                        },
                                        error: function(error) {
                                            // An error occurred...
                                            Janus.log(error.toString());
                                            stopStream();
                                        }
                                    });
                            }
                        },


                        onremotestream: function(stream) {
                            console.log("-- onremotestream --"); // DEBUUUG
                            // Invoked after send has got us a PeerConnection
                            // This is the remote video
                            var video = document.getElementById("remotevideo");
                            Janus.attachMediaStream(video, stream);
                            Janus.log("Stream Video binded");
                        },


                        error: function(cause) {
                            // Error, can't go on...
                            console.log("CONNEXION JANUS IMPOSSIBLE :");
                            console.log(cause.toString());
                        },
                        destroyed: function() {
                            // I should get rid of this
                        }

                    });
                },


            });
    }
});